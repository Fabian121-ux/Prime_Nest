
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Transaction = {
  id: string
  item: string
  otherParty: string
  amount: string
  status: 'Funds Held' | 'Completed' | 'Disputed'
  date: string
}

const transactions: Transaction[] = [
  {
    id: 'TXN72398',
    item: 'Expert Plumbing Services',
    otherParty: 'David Okoro',
    amount: '₦25,000',
    status: 'Funds Held',
    date: '2024-07-15',
  },
  {
    id: 'TXN65123',
    item: 'Modern Apartment Rent',
    otherParty: 'Aminu Bello',
    amount: '₦1,500,000',
    status: 'Completed',
    date: '2024-07-10',
  },
  {
    id: 'TXN58901',
    item: 'Electrical Wiring',
    otherParty: 'Femi Adebayo',
    amount: '₦120,000',
    status: 'Disputed',
    date: '2024-07-05',
  },
  {
    id: 'TXN44098',
    item: 'Family Villa Deposit',
    otherParty: 'Jane Doe',
    amount: '₦500,000',
    status: 'Completed',
    date: '2024-06-28',
  },
]

const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
  const statusConfig = {
    'Funds Held': {
      icon: <Clock className="h-3 w-3" />,
      variant: 'secondary',
      className: 'text-trust bg-trust/10 border-trust/20',
    },
    Completed: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      variant: 'success',
      className: '',
    },
    Disputed: {
      icon: <AlertTriangle className="h-3 w-3" />,
      variant: 'destructive',
      className: '',
    },
  }[status]

  return (
    <Badge
      variant={statusConfig.variant as any}
      className={cn('gap-1.5', statusConfig.className)}
    >
      {statusConfig.icon}
      <span>{status}</span>
    </Badge>
  )
}

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold font-headline">
          <Wallet className="h-8 w-8" />
          Escrow Wallet
        </h1>
        <p className="text-muted-foreground">
          Manage your transactions and funds with confidence.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦2,120,000</div>
            <p className="text-xs text-muted-foreground">
              Ready for withdrawal
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total in Escrow
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦25,000</div>
            <p className="text-xs text-muted-foreground">
              1 active transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="w-full sm:w-auto">
          <ArrowDown className="mr-2 h-4 w-4" />
          Deposit Funds
        </Button>
        <Button variant="secondary" className="w-full sm:w-auto">
          <ArrowUp className="mr-2 h-4 w-4" />
          Withdraw Funds
        </Button>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            A record of all your escrow activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="font-medium">{tx.item}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.otherParty} ({tx.id})
                      </div>
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden">
            {transactions.map((tx) => (
              <Card key={tx.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{tx.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.otherParty}
                    </p>
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-lg font-bold">{tx.amount}</p>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
