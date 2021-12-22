import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material';

const StyledCheckbox = styled(Checkbox)`
`;

export default ((({
    handleOnChange, allSelected, selectAll, unSelectAll, options,
}) => (
    <div>
        <div>
            <FormControlLabel
                control={<StyledCheckbox checked={allSelected} inputProps={{ 'aria-label': 'controlled' }} />}
                label="Select all"
                onClick={() => (allSelected ? unSelectAll() : selectAll())}
            />
        </div>
        <Grid container>
            {options.map((option) => (
                <Grid key={option.id} item xs={4}>
                    <FormControlLabel
                        control={<StyledCheckbox checked={option.checked} inputProps={{ 'aria-label': 'controlled' }} />}
                        label={option.label}
                        onClick={() => handleOnChange(option.id)}
                        onChange={(e) => console.log(e)}
                    />
                </Grid>
            ))}
        </Grid>
    </div>
))) as React.FC<{
  options: {
    id: string,
    checked: boolean,
    label: string,
  }[];
  handleOnChange: (id: string) => void;
  selectAll: () => void;
  unSelectAll: () => void;
  allSelected: boolean;
}>;
