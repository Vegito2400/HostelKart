export {
  Dialog as AlertDialog,
  DialogTrigger as AlertDialogTrigger,
  DialogContent as AlertDialogContent,
  DialogHeader as AlertDialogHeader,
  DialogFooter as AlertDialogFooter,
  DialogTitle as AlertDialogTitle,
  DialogDescription as AlertDialogDescription,
} from "./dialog";
import { Button } from "./button";

export const AlertDialogCancel = (props) => <Button variant="outline" {...props} />;
export const AlertDialogAction = (props) => <Button {...props} />;
