import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { History, CreditCard, Download, TrendingUp, TrendingDown } from 'lucide-react';
const CreditHistory: React.FC = () => {
  const transactions = [{
    id: 'TXN-001',
    type: 'Purchase',
    credits: 1000,
    cost: '$49.99',
    date: '2024-01-15',
    description: 'Monthly credit pack'
  }, {
    id: 'TXN-002',
    type: 'Usage',
    credits: -150,
    cost: null,
    date: '2024-01-14',
    description: 'Lead generation campaign'
  }, {
    id: 'TXN-003',
    type: 'Usage',
    credits: -75,
    cost: null,
    date: '2024-01-13',
    description: 'Email template processing'
  }, {
    id: 'TXN-004',
    type: 'Bonus',
    credits: 100,
    cost: null,
    date: '2024-01-12',
    description: 'Welcome bonus credits'
  }, {
    id: 'TXN-005',
    type: 'Usage',
    credits: -200,
    cost: null,
    date: '2024-01-11',
    description: 'Bulk lead import'
  }, {
    id: 'TXN-006',
    type: 'Purchase',
    credits: 500,
    cost: '$24.99',
    date: '2024-01-10',
    description: 'Starter credit pack'
  }];
  const currentCredits = 1075;
  const creditLimit = 2000;
  const usagePercentage = (creditLimit - currentCredits) / creditLimit * 100;
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Credit History</h1>
          <p className="text-muted-foreground">Track your credit usage and purchases</p>
        </div>
        <Button className="gap-2">
          <CreditCard className="w-4 h-4" />
          Buy Credits
        </Button>
      </div>

      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Usage</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425</div>
            <p className="text-xs text-muted-foreground">Credits consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchased</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,500</div>
            <p className="text-xs text-muted-foreground">All time credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage</CardTitle>
          <CardDescription>Your current credit consumption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Used: {(creditLimit - currentCredits).toLocaleString()} credits</span>
              <span>Available: {currentCredits.toLocaleString()} credits</span>
            </div>
            <Progress value={usagePercentage} className="w-full" />
          </div>
          
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Detailed credit purchase and usage history</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map(transaction => <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'Purchase' ? 'bg-green-100 text-green-600' : transaction.type === 'Usage' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {transaction.type === 'Purchase' ? <TrendingUp className="w-5 h-5" /> : transaction.type === 'Usage' ? <TrendingDown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">Transaction ID: {transaction.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className={`font-medium ${transaction.credits > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.credits > 0 ? '+' : ''}{transaction.credits.toLocaleString()} credits
                      </p>
                      {transaction.cost && <p className="text-sm text-muted-foreground">{transaction.cost}</p>}
                    </div>
                    <Badge variant={transaction.type === 'Purchase' ? 'default' : transaction.type === 'Usage' ? 'destructive' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default CreditHistory;