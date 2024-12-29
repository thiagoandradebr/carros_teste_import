import React from 'react';
import { ServiceFormStep, ServiceFormValidations } from '@/types/service';
import { 
  User, 
  Car, 
  Clock, 
  CheckCircle, 
  FileText,
  DollarSign,
  Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: ServiceFormStep;
  validations: ServiceFormValidations;
  onStepChange: (step: ServiceFormStep) => void;
  steps: {
    id: ServiceFormStep;
    label: string;
  }[];
}

export function ServiceFormStepper({ currentStep, validations, onStepChange, steps }: StepperProps) {
  const stepsWithIcons = steps.map(step => {
    let icon: React.ReactNode;
    switch (step.id) {
      case ServiceFormStep.SelectCustomer:
        icon = <User className="h-5 w-5" />;
        break;
      case ServiceFormStep.AddVehicles:
        icon = <Car className="h-5 w-5" />;
        break;
      case ServiceFormStep.DefineWorkDays:
        icon = <Clock className="h-5 w-5" />;
        break;
      case ServiceFormStep.Expenses:
        icon = <DollarSign className="h-5 w-5" />;
        break;
      case ServiceFormStep.Review:
        icon = <FileText className="h-5 w-5" />;
        break;
      default:
        icon = <CheckCircle className="h-5 w-5" />;
    }

    let completed = false;
    switch (step.id) {
      case ServiceFormStep.SelectCustomer:
        completed = validations.customerSelected;
        break;
      case ServiceFormStep.AddVehicles:
        completed = validations.vehiclesAdded;
        break;
      case ServiceFormStep.DefineWorkDays:
        completed = validations.workDaysComplete;
        break;
      case ServiceFormStep.Expenses:
        completed = validations.expensesAdded;
        break;
      case ServiceFormStep.Review:
        completed = false;
        break;
    }

    return {
      ...step,
      icon,
      completed
    };
  });

  return (
    <div className="flex justify-between items-center mb-8">
      {stepsWithIcons.map((step, index) => (
        <React.Fragment key={step.id}>
          <Button
            variant={currentStep === step.id ? "default" : "ghost"}
            className={cn(
              "flex flex-col items-center gap-2 p-3 relative transition-all duration-200 hover:scale-105 min-w-[100px]",
              currentStep === step.id && "bg-primary/20 text-primary shadow-sm border-2 border-primary",
              step.completed && "text-primary hover:text-primary/90",
              !step.completed && currentStep !== step.id && "text-muted-foreground hover:text-primary/70"
            )}
            onClick={() => onStepChange(step.id)}
            disabled={!step.completed && currentStep !== step.id}
          >
            <div className="relative">
              {step.icon}
              {step.completed && (
                <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5 shadow-sm">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{step.label}</span>
          </Button>
          {index < stepsWithIcons.length - 1 && (
            <div className={cn(
              "h-[2px] flex-1",
              step.completed ? "bg-primary" : "bg-muted"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
