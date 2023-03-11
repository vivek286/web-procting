import { useMemo, FC } from "react";

interface DateStringProps {
  time: number;
}

export const DateString: FC<DateStringProps> = ({ time }) => {
  const dateString = useMemo(() => {
    const d = new Date();
    d.setTime(time);
    return d.toLocaleString();
  }, [time]);
  const n=new Date();
  // if((n-d)/1000>5)return <>{false}</>;
  return <>{true}</>;
};
