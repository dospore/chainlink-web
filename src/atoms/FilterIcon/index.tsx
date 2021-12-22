import { styled } from '@mui/material';
import { ReactComponent as FilterIcon } from './icon.svg';

export default styled(FilterIcon)`
  height: 2rem;
  width: 2rem;
  color: white;
  transition: 0.3s;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;
