import Result from '@/components/Result';
import { Button } from '@/shadcn-ui/ui/button';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  return (
    <Result
      title="500"
      description="对不起，出了点问题。"
      extra={
        <Button onClick={() => navigate('/')}>
          返回首页
        </Button>
      }
    />
  );
};

