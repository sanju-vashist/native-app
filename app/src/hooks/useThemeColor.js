import { useColorScheme } from 'react-native';
// import { Colors } from '@/constants/Colors';
import { Colors } from '../constants/Colors';

export function useThemeColor(props) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme === 'dark' ? 'dark' : 'light'];
}