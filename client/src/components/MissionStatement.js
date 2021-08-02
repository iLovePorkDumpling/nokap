import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NotesIcon from '@material-ui/icons/Notes';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '70%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function MissionStatement() {
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container spacing={1}>
        <Grid item xs={7}>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem button>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="NOKAP promotes a cultural core that exemplifies community, supporting each other in learning this game together, having fun together, and celebrating our wins and mourning our losses TOGETHER." />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="We expect all members to behave well in our discord, in other discords, and in game.  That means that you will behave with diligence, respect, and honour towards your clan brethren.  We expect all members to lift each other up, teach and learn, and be a friend to everyone in this clan." />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="Mentorship and development is key: we are all teachers and we expect all players in NOKAP to exemplify the role of a warrior / philosopher / mentor to all regardless of rank or affiliation." />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <NotesIcon />
              </ListItemIcon>
              <ListItemText primary="NOKAP is a clan battle clan.  We expect all players in the clan to be playing in clan battles and supporting the community.  If you're not interested in Clan Battles please reach out to a CO so we can take the time to move you over to n0kap.  We want to make sure we have a full participating roster." />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default MissionStatement;