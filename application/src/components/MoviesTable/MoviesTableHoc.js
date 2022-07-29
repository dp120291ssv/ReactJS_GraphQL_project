import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import { styles } from './styles';
import { moviesQuery } from './queries';

export default compose(withStyles(styles), graphql(moviesQuery));
