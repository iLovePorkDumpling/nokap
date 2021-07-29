import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GavelIcon from '@material-ui/icons/Gavel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '70%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function Rules() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <GavelIcon />
          </ListItemIcon>
          <ListItemText primary="If you are in game be in Discord.  Your activity in game and your presence in Discord are the two main factors that leadership uses to assess your activity. promotes a cultural core that exemplifies community, supporting each other in learning this game together, having fun together, and celebrating our wins and mourning our losses TOGETHER." />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <GavelIcon />
          </ListItemIcon>
          <ListItemText primary="Please schedule your time and let us know if you will not be able to participate.  Clan Battles and KOTS are a commitment but real life comes first, obviously.  If you plan to play, please plan to play consistently so the callers can have an idea, roughly, of who will be available." />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <GavelIcon />
          </ListItemIcon>
          <ListItemText primary="If you have friends and other clans you want to merc with that's fine, but please check in with NOKAP and n0kap first each day.  Our clan divisions should be your first priority, always." />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <GavelIcon />
          </ListItemIcon>
          <ListItemText primary="There is no room in this clan for bullying, stat shaming, or denigrating each other or our fellow players.  We are all trying to git gud and we only have each other to do it with." />
        </ListItem>
      </List>
    </div>
  );
}

export default Rules;