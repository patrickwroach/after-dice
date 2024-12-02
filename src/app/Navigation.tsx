import React from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faDoorOpen,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface NavigationProps {
  inRoom: boolean;
  onToggleCharacterSheet: () => void;
  onSignOut: () => void;
  onLeaveRoom: () => void;
  skipLogin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  inRoom,
  onToggleCharacterSheet,
  onSignOut,
  onLeaveRoom,
  skipLogin,
}) => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <IconButton color="inherit" onClick={onToggleCharacterSheet}>
          <FontAwesomeIcon icon={faUser} />
        </IconButton>
        {inRoom && (
          <IconButton color="inherit" onClick={onLeaveRoom}>
            <FontAwesomeIcon icon={faDoorOpen} />
          </IconButton>
        )}
        {!skipLogin && (
          <IconButton color="inherit" onClick={onSignOut}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
