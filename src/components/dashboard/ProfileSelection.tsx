
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, GraduationCap, Home, User, Users } from "lucide-react";
import { useState } from "react";

interface ProfileSelectionProps {
  onProfileChange: (name: string, type: string) => void;
  currentProfile: {
    name: string;
    type: string;
  };
}

const ProfileSelection = ({ onProfileChange, currentProfile }: ProfileSelectionProps) => {
  const [name, setName] = useState(currentProfile.name);
  const [type, setType] = useState(currentProfile.type);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = () => {
    onProfileChange(name, type);
    setIsOpen(false);
  };
  
  const getProfileIcon = () => {
    switch (currentProfile.type) {
      case 'salary':
        return <Briefcase className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      case 'business':
        return <Users className="h-4 w-4" />;
      case 'housewife':
        return <Home className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };
  
  const getProfileTitle = (type: string) => {
    switch (type) {
      case 'salary':
        return 'Salary Employee';
      case 'student':
        return 'Student';
      case 'business':
        return 'Business Owner';
      case 'housewife':
        return 'Housewife';
      default:
        return 'User';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="budget-card cursor-pointer hover:border-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">My Profile</CardTitle>
            <CardDescription>Click to change profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${currentProfile.name}`} />
                <AvatarFallback>{currentProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{currentProfile.name}</div>
                <div className="text-xs text-muted-foreground flex items-center">
                  {getProfileIcon()}
                  <span className="ml-1">{getProfileTitle(currentProfile.type)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Profile Type</Label>
            <RadioGroup 
              defaultValue={type} 
              onValueChange={setType}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salary" id="salary" />
                <Label htmlFor="salary" className="flex items-center space-x-2 cursor-pointer">
                  <Briefcase className="h-4 w-4" />
                  <span>Salary Employee</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer">
                  <GraduationCap className="h-4 w-4" />
                  <span>Student</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  <span>Business Owner</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="housewife" id="housewife" />
                <Label htmlFor="housewife" className="flex items-center space-x-2 cursor-pointer">
                  <Home className="h-4 w-4" />
                  <span>Housewife</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="mt-2"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSelection;
