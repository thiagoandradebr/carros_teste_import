import { Input } from "@/components/ui/input";
import { forwardRef } from "react";
import InputMask from "react-input-mask";

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  maskPlaceholder?: string;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, maskPlaceholder = "_", ...props }, ref) => {
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={maskPlaceholder}
        {...props}
      >
        {(inputProps: any) => <Input ref={ref} {...inputProps} />}
      </InputMask>
    );
  }
);
