import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">LLM Prompt Tracker</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Manage and test your prompts across OpenAI, Perplexity, and Gemini
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
