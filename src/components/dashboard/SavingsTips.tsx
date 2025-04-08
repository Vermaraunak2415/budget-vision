
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SavingsTipsProps {
  profileType: string;
}

const SavingsTips = ({ profileType }: SavingsTipsProps) => {
  const getTipsForProfile = (type: string) => {
    switch (type) {
      case 'salary':
        return [
          "Save at least 20% of your monthly income for emergencies",
          "Take advantage of tax-saving investments like PPF, ELSS, and NPS",
          "Create separate funds for long-term goals like home purchase",
          "Track and reduce everyday expenses to increase monthly savings"
        ];
      case 'student':
        return [
          "Create a monthly budget based on your allowance or part-time income",
          "Use student discounts whenever possible (transport, food, entertainment)",
          "Choose affordable living options and split utilities with roommates",
          "Avoid unnecessary education loans and credit card debt"
        ];
      case 'business':
        return [
          "Separate personal and business finances with different accounts",
          "Track all business expenses meticulously for tax deductions",
          "Maintain an emergency fund for 3-6 months of business expenses",
          "Reinvest profits strategically in the business for growth"
        ];
      case 'housewife':
        return [
          "Build a household budget with clear expense categories",
          "Plan meals in advance to avoid food waste and unnecessary purchases",
          "Consider small home-based business opportunities",
          "Start a family emergency fund with at least 6 months of expenses"
        ];
      default:
        return [
          "Track all your expenses to identify spending patterns",
          "Create a budget with clear categories for better financial control",
          "Build an emergency fund with 3-6 months of expenses",
          "Review and cut unnecessary subscriptions and services"
        ];
    }
  };
  
  return (
    <Card className="budget-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Lightbulb className="h-4 w-4 mr-2 text-budget-yellow" />
          Personalized Saving Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {getTipsForProfile(profileType).map((tip, index) => (
            <li key={index} className="text-muted-foreground">{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SavingsTips;
