import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Box,
  Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface Book {
  id: string;
  titulo: string;
  autor?: string;
  descricao?: string;
  status: 'Quero Ler' | 'Lendo' | 'Lido';
  avaliacao?: number;
  data_conclusao?: string;
  id_leitor: number;
}

interface BookFormData {
  titulo: string;
  autor?: string;
  descricao?: string;
  status: 'Quero Ler' | 'Lendo' | 'Lido';
  avaliacao?: number;
  data_conclusao?: string;
}

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (book: BookFormData & { id_leitor: number }) => void;
  initialData?: Book;
}

export function BookForm({ open, onClose, onSubmit, initialData }: BookFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookFormData>({
    titulo: '',
    autor: '',
    descricao: '',
    status: 'Quero Ler',
    avaliacao: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo,
        autor: initialData.autor || '',
        descricao: initialData.descricao || '',
        status: initialData.status,
        avaliacao: initialData.avaliacao || 0
      });
    } else {
      // Reset form when opening for new book
      setFormData({
        titulo: '',
        autor: '',
        descricao: '',
        status: 'Quero Ler',
        avaliacao: 0
      });
    }
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | 
    (Event & { target: { value: string; name: string } })
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('Usuário não autenticado');
      alert('Você precisa estar logado para adicionar ou editar livros.');
      return;
    }

    const dataToSubmit = {
      ...formData,
      id_leitor: user.id
    };

    // Se o status não for Lido, remove os campos específicos
    if (formData.status !== 'Lido') {
      delete dataToSubmit.avaliacao;
    }

    // Sempre remove a data de conclusão, pois será gerenciada pelo backend
    delete dataToSubmit.data_conclusao;

    onSubmit(dataToSubmit);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'Editar Livro' : 'Adicionar Novo Livro'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="titulo"
            label="Título"
            type="text"
            fullWidth
            required
            value={formData.titulo}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="autor"
            label="Autor"
            type="text"
            fullWidth
            value={formData.autor}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="descricao"
            label="Descrição"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.descricao}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="Quero Ler">Quero Ler</MenuItem>
              <MenuItem value="Lendo">Lendo</MenuItem>
              <MenuItem value="Lido">Lido</MenuItem>
            </Select>
          </FormControl>
          
          {formData.status === 'Lido' && (
            <>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography component="legend">Avaliação</Typography>
                <Rating
                  name="avaliacao"
                  value={formData.avaliacao}
                  onChange={(_, newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      avaliacao: newValue || 0
                    }));
                  }}
                  precision={0.5}
                  icon={<StarIcon fontSize="large" />}
                  emptyIcon={<StarIcon fontSize="large" />}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 