import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, DollarSign, Calendar, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage lunch subscriptions and employee preferences.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Subscribers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹2,80,800</div>
              <p className="text-xs text-muted-foreground">
                Employee share: ₹1,40,400
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscription Window
              </CardTitle>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Open
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2</div>
              <p className="text-xs text-muted-foreground">Based on feedback</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Menu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  • Sambar • Rasam • Phulka • Curd Rice
                </div>
                <div className="text-sm text-gray-600">
                  • Beetroot Poriyal • Appalam • Pickle
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Expected attendees: 142
                </span>
                <Button size="sm" variant="outline">
                  Edit Menu
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Subscription Window</p>
                  <p className="text-sm text-gray-500">
                    Allow new subscriptions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-renewal</p>
                  <p className="text-sm text-gray-500">
                    Automatically renew subscriptions
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="w-full mt-4">Send Monthly Reminder</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">
                    "Great variety in this week's menu!"
                  </p>
                  <p className="text-xs text-gray-500">
                    John Doe - 2 hours ago
                  </p>
                </div>
                <Badge variant="secondary">★ 5</Badge>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">
                    "Could use more vegetarian options."
                  </p>
                  <p className="text-xs text-gray-500">
                    Jane Smith - 1 day ago
                  </p>
                </div>
                <Badge variant="secondary">★ 3</Badge>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">
                    "Food quality has improved significantly."
                  </p>
                  <p className="text-xs text-gray-500">
                    Mike Johnson - 2 days ago
                  </p>
                </div>
                <Badge variant="secondary">★ 4</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
