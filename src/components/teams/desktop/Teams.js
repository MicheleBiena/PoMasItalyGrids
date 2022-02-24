import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  changeTeamSyncPairFilter,
  changeTeamTagFilter,
  changeTeamSort,
} from '../../../actions/actionCreators';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import syncPairNamesAndIds from '../../../data/syncPairNamesAndIds.json';
import TextField from '@material-ui/core/TextField';
import { tags } from '../../../utils/constants';
import UI from '../../../utils/translations';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Teams = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const sort = useSelector((state) => state.team.sort);
  const syncPairFilter = useSelector((state) => state.team.syncPairFilter);
  const teamTagFilter = useSelector((state) => state.team.teamTagFilter);
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.currentLanguage);
  const darkMode = useSelector((state) => state.darkMode.mode);

  let syncPairs = Object.values(syncPairNamesAndIds);

  useEffect(() => {
    if (props.history) {
      if (props.history.location.pathname === '/teams/liked') {
        setValue(1);
      } else if (props.history.location.pathname === '/teams/users') {
        setValue(2);
      } else {
        setValue(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTab = (event, newValue) => {
    let val;
    if (newValue === 0) {
      val = 'popular';
    } else if (newValue === 1) {
      val = 'liked';
    } else {
      val = 'users';
    }
    props.history.push(`/teams/${val}`);
    setValue(newValue);
  };

  const handleChangeSort = (event) => {
    if (event.target.value) {
      dispatch(changeTeamSort(event.target.value));
    }
  };

  const handleChangeSyncPairFilter = (value) => {
    if (value) {
      dispatch(changeTeamSyncPairFilter(value.trainerId));
    } else {
      dispatch(changeTeamSyncPairFilter('None'));
    }
  };

  const handleChangeTagFilter = (value) => {
    dispatch(changeTeamTagFilter(value));
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : null}`}>
      <div className="container container-s">
        <br />
        <Paper width={1} className={classes.root}>
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={handleChangeTab}
            style={{ margin: 'auto' }}
            centered
          >
            <Tab label="Popular Teams" />
            <Tab label="Liked Teams" />
            <Tab label="My Published Teams" />
          </Tabs>
        </Paper>
        <Paper width={1} className={classes.root} style={{ marginBottom: 20 }}>
          <FormControl className={classes.formControl}>
            <Select value={sort} labelId="sort" onChange={handleChangeSort}>
              <MenuItem value="popular">Popular</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>

          <div style={{ marginBottom: 6, marginLeft: 10 }}>
            <Autocomplete
              id={`tag-filter`}
              size="small"
              multiple
              value={teamTagFilter}
              options={tags}
              getOptionLabel={(option) =>
                UI[option] ? UI[option][language] : option
              }
              autoComplete
              includeInputInList
              onChange={(event, value) => handleChangeTagFilter(value)}
              renderInput={(params) => (
                <TextField
                  style={{ minWidth: 230 }}
                  {...params}
                  margin="normal"
                  placeholder={UI['Tags'][language]}
                />
              )}
            />
          </div>

          <div style={{ marginBottom: 6, marginLeft: 10 }}>
            <Autocomplete
              id={`team-filter`}
              size="small"
              value={
                syncPairNamesAndIds[syncPairFilter]
                  ? syncPairNamesAndIds[syncPairFilter]
                  : ''
              }
              options={syncPairs.sort((a, b) => {
                let x = a['syncPairNameByLanguage'][language];
                let y = b['syncPairNameByLanguage'][language];
                return x < y ? -1 : x > y ? 1 : 0;
              })}
              getOptionLabel={(option) =>
                option['syncPairNameByLanguage']
                  ? option.isEggmon
                    ? `${option['syncPairNameByLanguage'][language]} (${option['roleTypeNameByLanguage'][language]})`
                    : option['syncPairNameByLanguage'][language]
                  : ''
              }
              autoComplete
              includeInputInList
              onChange={(event, value) => handleChangeSyncPairFilter(value)}
              renderInput={(params) => (
                <TextField
                  style={{ width: 330 }}
                  {...params}
                  margin="normal"
                  placeholder={UI['Sync Pair'][language]}
                />
              )}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default withRouter(Teams);
