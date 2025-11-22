import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { AlertCircle } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle className="size-16 mx-auto text-muted-foreground" />
        <h1>404 - Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/')}>Go to Inbox</Button>
      </div>
    </div>
  );
}
