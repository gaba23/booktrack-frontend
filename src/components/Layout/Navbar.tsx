import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Menu, 
  MenuItem, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../contexts/AuthContext.tsx';
import api from '../../services/api.ts';

export function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      if (user) {
        const userId = user.id.toString();
        await api.delete(`/users/deletar/${userId}`);
        signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          size="large"
          aria-label="menu de conta"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{ 
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
          <MenuItem 
            onClick={() => {
              handleClose();
              setOpenDialog(true);
            }}
            sx={{ color: 'error.main' }}
          >
            Excluir Conta
          </MenuItem>
        </Menu>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>Excluir Conta</DialogTitle>
          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                handleDeleteAccount();
              }} 
              color="error"
            >
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}