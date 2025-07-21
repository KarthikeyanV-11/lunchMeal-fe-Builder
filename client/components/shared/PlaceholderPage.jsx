import { Layout } from "./Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export const PlaceholderPage = ({
  title,
  description = "This page is under development. Continue prompting to add content here.",
}) => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <Construction className="h-16 w-16 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-sm text-gray-500">
              Ask the assistant to implement specific functionality for this
              page.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
