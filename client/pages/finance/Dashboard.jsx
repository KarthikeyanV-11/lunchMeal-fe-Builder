import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, CheckCircle, AlertCircle } from "lucide-react";

export default function FinanceDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Finance Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage payroll exports and financial reconciliation.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,80,800</div>
              <p className="text-xs text-muted-foreground">
                December 2024 total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Employee Share
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,40,400</div>
              <p className="text-xs text-muted-foreground">50% of total cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Company Share
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,40,400</div>
              <p className="text-xs text-muted-foreground">
                50% subsidy amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reconciliation
              </CardTitle>
              {true ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-muted-foreground">November 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Payroll Export</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">
                    Ready for Export - December 2024
                  </p>
                  <p className="text-sm text-gray-600">
                    156 employee subscriptions
                  </p>
                  <p className="text-sm text-gray-600">
                    Total deductions: ₹1,40,400
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm">Export CSV</Button>
                  <Button size="sm" variant="outline">
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">November 2024</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">December 2024</span>
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                <Button size="sm" className="w-full">
                  Mark December Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Monthly Financial Summary - December 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Working Days</h4>
                <p className="text-2xl font-bold">22</p>
                <p className="text-sm text-gray-500">Total this month</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Average Daily Cost
                </h4>
                <p className="text-2xl font-bold">₹12,764</p>
                <p className="text-sm text-gray-500">Per working day</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Subscriber Rate
                </h4>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-gray-500">Of total employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
