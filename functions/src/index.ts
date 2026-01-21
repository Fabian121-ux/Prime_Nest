import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * Creates a Deal and a corresponding Escrow document in a secure backend environment.
 *
 * @param {object} data - The data passed to the function.
 * @param {string} data.listingId - The ID of the listing for which the deal is being created.
 * @param {number} data.amount - The total amount for the deal.
 * @param {functions.https.CallableContext} context - The context of the function call.
 *
 * @returns {Promise<{dealId: string}>} A promise that resolves with the ID of the newly created deal.
 * @throws {functions.https.HttpsError} - Throws an error if the user is not authenticated,
 * if the arguments are invalid, or if an internal error occurs.
 */
export const createDeal = functions.https.onCall(async (data, context) => {
  // 1. Verify user authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  const buyerId = context.auth.uid;

  // 2. Validate input arguments
  const { listingId, amount } = data;
  if (!listingId || typeof listingId !== 'string' || !amount || typeof amount !== 'number' || amount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a valid 'listingId' and a positive 'amount'."
    );
  }

  try {
    const listingRef = db.collection("listings").doc(listingId);
    const listingDoc = await listingRef.get();

    if (!listingDoc.exists) {
      throw new functions.https.HttpsError("not-found", "The specified listing does not exist.");
    }
    
    // 3. Fetch listing owner to use as sellerId
    const listingData = listingDoc.data();
    if (!listingData || !listingData.ownerId) {
        throw new functions.https.HttpsError("internal", "Could not retrieve seller information from the listing.");
    }
    const sellerId = listingData.ownerId;

    if (buyerId === sellerId) {
        throw new functions.https.HttpsError("failed-precondition", "A user cannot create a deal with themselves.");
    }
    
    const now = admin.firestore.FieldValue.serverTimestamp();

    // 4. Create the escrow document first
    const escrowRef = await db.collection("escrows").add({
        payerId: buyerId,
        payeeId: sellerId,
        listingId: listingId,
        amount: amount,
        currency: 'NGN', // Assuming NGN currency for now
        status: 'initiated',
        createdAt: now,
    });
    const escrowId = escrowRef.id;

    // 5. Create the deal document, linking it to the new escrow
    const dealRef = await db.collection("deals").add({
        listingId: listingId,
        buyerId: buyerId,
        sellerId: sellerId,
        escrowId: escrowId,
        conversationId: data.conversationId || null, // Optional conversation ID
        amount: amount,
        status: 'initiated',
        createdAt: now,
        updatedAt: now,
    });
    const dealId = dealRef.id;
    
    // 6. Return the new dealId to the client
    return { dealId: dealId };

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating deal:", error);

    // Re-throw HttpsError to be sent to the client
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    // For other errors, throw a generic internal error
    throw new functions.https.HttpsError("internal", "An unexpected error occurred while creating the deal.");
  }
});
