import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Wallet, Building2, BarChart3, Target } from 'lucide-react';

const options = {
  step1: {
    question1: [
      { icon: '🔁', label: 'Build wealth over the long term through investing', value: 'wealth_building' },
      { icon: '💰', label: 'Grow savings and feel financially secure', value: 'savings_security' },
      { icon: '🏦', label: 'Pay down debt as quickly as possible', value: 'debt_payoff' },
      { icon: '📈', label: 'Maximise monthly cash flow and flexibility', value: 'cash_flow' },
      { icon: '🎯', label: 'A mix of the above (not sure yet)', value: 'mixed' },
    ],
    question2: [
      { label: 'Be debt-free', value: 'debt_free' },
      { label: 'Own a property', value: 'own_property' },
      { label: 'Have a strong investment portfolio', value: 'investment_portfolio' },
      { label: 'Have a solid emergency fund', value: 'emergency_fund' },
      { label: 'Be able to work less / retire early', value: 'early_retirement' },
    ]
  },
  step2: {
    question1: [
      { label: 'Invest a portion straight away', value: 'invest_first' },
      { label: 'Save a portion for future goals', value: 'save_first' },
      { label: 'Pay off debts or bills first', value: 'pay_debts' },
      { label: 'Make sure I have enough left for lifestyle/fun', value: 'lifestyle_first' },
    ],
    question2: [
      { label: "I'm comfortable taking risks for higher returns", value: 'high_risk' },
      { label: 'I prefer a balanced approach', value: 'balanced' },
      { label: 'I want stability and predictability', value: 'low_risk' },
      { label: 'I want to avoid any financial risk', value: 'no_risk' },
    ],
    question3: [
      { label: 'Weekly', value: 'weekly' },
      { label: 'Monthly', value: 'monthly' },
      { label: 'A few times a year', value: 'few_times_year' },
      { label: 'Rarely or never', value: 'rarely' },
    ]
  },
  step3: {
    question1: [
      { label: "I'm focused on building wealth from a stable income", value: 'building_wealth' },
      { label: "I'm trying to pay off debt (e.g. credit cards, loans)", value: 'paying_debt' },
      { label: "I'm saving for a major goal (house, family, travel, etc.)", value: 'major_goal' },
      { label: "I'm trying to get a handle on my monthly spending", value: 'managing_spending' },
    ],
    question2: [
      { label: 'Increase my investments', value: 'increase_investments' },
      { label: 'Build or grow my savings', value: 'grow_savings' },
      { label: 'Eliminate debt quickly', value: 'eliminate_debt' },
      { label: 'Free up more money every month', value: 'free_up_money' },
    ],
    question3: [
      { label: 'Yes, monthly', value: 'monthly' },
      { label: 'Occasionally', value: 'occasionally' },
      { label: "Not yet, but I'm interested", value: 'interested' },
      { label: "No, and I'm not planning to", value: 'not_planning' },
    ]
  },
  step4: {
    question1: [
      { label: 'A planner — I like strategies and clear steps', value: 'planner' },
      { label: "A learner — I want to understand the 'why'", value: 'learner' },
      { label: 'A doer — Just tell me what to do', value: 'doer' },
      { label: "A delegator — I'd rather it be automated", value: 'delegator' },
    ]
  }
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    financial_goal: '',
    future_goal: '',
    payment_behavior: '',
    risk_tolerance: '',
    finance_tracking_frequency: '',
    current_situation: '',
    top_priority: '',
    investment_frequency: '',
    finance_personality: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = (step / 4) * 100;

  const handleAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return answers.financial_goal && answers.future_goal;
      case 2:
        return answers.payment_behavior && answers.risk_tolerance && answers.finance_tracking_frequency;
      case 3:
        return answers.current_situation && answers.top_priority && answers.investment_frequency;
      case 4:
        return answers.finance_personality;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...answers,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Welcome aboard! 🎉',
        description: "You're all set. Let's start managing your finances!",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const OptionButton = ({ option, field, selected }: { option: any; field: string; selected: boolean }) => (
    <button
      onClick={() => handleAnswer(field, option.value)}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02] hover:shadow-md ${
        selected
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-center gap-3">
        {option.icon && <span className="text-2xl">{option.icon}</span>}
        <span className="text-sm font-medium">{option.label}</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-3xl p-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                {step === 1 && <Target className="w-6 h-6 text-primary" />}
                {step === 2 && <TrendingUp className="w-6 h-6 text-primary" />}
                {step === 3 && <Wallet className="w-6 h-6 text-primary" />}
                {step === 4 && <BarChart3 className="w-6 h-6 text-primary" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Step {step} of 4</p>
                <p className="text-xs text-muted-foreground">Almost there!</p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Which of these feels closest to your main financial goal?</h2>
              <p className="text-muted-foreground">Choose the one that resonates most with you</p>
            </div>
            <div className="space-y-3">
              {options.step1.question1.map((option) => (
                <OptionButton
                  key={option.value}
                  option={option}
                  field="financial_goal"
                  selected={answers.financial_goal === option.value}
                />
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-xl font-bold">In 5 years, what would you most like to achieve financially?</h3>
              <div className="space-y-3">
                {options.step1.question2.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    field="future_goal"
                    selected={answers.future_goal === option.value}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">When you get paid, what's your usual first step?</h2>
            </div>
            <div className="space-y-3">
              {options.step2.question1.map((option) => (
                <OptionButton
                  key={option.value}
                  option={option}
                  field="payment_behavior"
                  selected={answers.payment_behavior === option.value}
                />
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-xl font-bold">How do you feel about risk when it comes to money?</h3>
              <div className="space-y-3">
                {options.step2.question2.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    field="risk_tolerance"
                    selected={answers.risk_tolerance === option.value}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-xl font-bold">How often do you track or review your finances?</h3>
              <div className="space-y-3">
                {options.step2.question3.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    field="finance_tracking_frequency"
                    selected={answers.finance_tracking_frequency === option.value}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Which of these describes your current situation best?</h2>
            </div>
            <div className="space-y-3">
              {options.step3.question1.map((option) => (
                <OptionButton
                  key={option.value}
                  option={option}
                  field="current_situation"
                  selected={answers.current_situation === option.value}
                />
              ))}
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-xl font-bold">What's your top priority right now?</h3>
              <div className="space-y-3">
                {options.step3.question2.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    field="top_priority"
                    selected={answers.top_priority === option.value}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="text-xl font-bold">Do you currently invest money regularly?</h3>
              <div className="space-y-3">
                {options.step3.question3.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    field="investment_frequency"
                    selected={answers.investment_frequency === option.value}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">When it comes to personal finance, you are…</h2>
              <p className="text-muted-foreground">This helps us personalize your experience</p>
            </div>
            <div className="space-y-3">
              {options.step4.question1.map((option) => (
                <OptionButton
                  key={option.value}
                  option={option}
                  field="finance_personality"
                  selected={answers.finance_personality === option.value}
                />
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : step === 4 ? 'Complete Setup 🎉' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
