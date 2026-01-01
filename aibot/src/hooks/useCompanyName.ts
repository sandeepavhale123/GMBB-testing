import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useCompanyName = () => {
  const companyName = useSelector((state: RootState) => state.theme.companyName);
  
  return companyName && companyName.trim() !== '' ? companyName : 'GMB Briefcase';
};