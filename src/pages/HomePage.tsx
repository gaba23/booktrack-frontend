import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { Navbar } from '../components/Layout/Navbar.tsx';
import api, { setAuthToken } from '../services/api.ts';

interface Book {
  id: string;
  titulo: string;
  autor: string;
  descricao?: string;
  status: 'Quero Ler' | 'Lendo' | 'Lido';
  avaliacao?: number;
  data_conclusao?: string;
  id_leitor: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBook, setNewBook] = useState<Partial<Book>>({ 
    titulo: '', 
    autor: '', 
    descricao: '',
    status: 'Quero Ler',
    avaliacao: 0
  });
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setAuthToken(token);
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        setUserId(decoded.id);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
      fetchBooks();
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/livros/meus-livros');
      setBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.response?.data?.message || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    try {
      const response = await api.post('/livros/adicionar', {
        titulo: newBook.titulo,
        autor: newBook.autor,
        descricao: newBook.descricao || '',
        status: newBook.status,
        avaliacao: newBook.status === 'Lido' ? newBook.avaliacao : null,
        data_conclusao: newBook.status === 'Lido' ? new Date().toISOString() : null
      });
      setBooks([...books, response.data]);
      setOpenDialog(false);
      setNewBook({ titulo: '', autor: '', descricao: '', status: 'Quero Ler', avaliacao: 0 });
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.message || 'Erro ao adicionar livro');
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await api.delete(`/livros/excluir/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err.response?.data?.message || 'Erro ao excluir livro');
    }
  };

  const handleEditBook = async (id: string) => {
    try {
      const livroParaEditar = books.find(book => book.id === id);
      if (livroParaEditar) {
        setNewBook(livroParaEditar);
        setOpenDialog(true);
      }
    } catch (err) {
      setError('Erro ao editar livro');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/livros/editar/${newBook.id}`, {
        titulo: newBook.titulo,
        autor: newBook.autor,
        descricao: newBook.descricao || '',
        status: newBook.status,
        avaliacao: newBook.status === 'Lido' ? newBook.avaliacao : null,
        data_conclusao: newBook.status === 'Lido' ? new Date().toISOString() : null
      });
      setBooks(books.map(book => book.id === newBook.id ? response.data : book));
      setOpenDialog(false);
      setNewBook({ titulo: '', autor: '', descricao: '', status: 'Quero Ler', avaliacao: 0 });
    } catch (err) {
      console.error('Error editing book:', err);
      setError(err.response?.data?.message || 'Erro ao salvar edição');
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
        <Card sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1">
                Minha Biblioteca
              </Typography>
            </Box>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : books.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Nenhum livro encontrado. Adicione seu primeiro livro!
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {books.map((book) => (
                <Box key={book.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {book.titulo}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                        {book.autor}
                      </Typography>
                      {book.descricao && (
                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                          {book.descricao}
                        </Typography>
                      )}
                      <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                        Status: {book.status}
                      </Typography>
                      {book.status === 'Lido' && book.avaliacao && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">Avaliação:</Typography>
                          <Rating 
                            value={book.avaliacao} 
                            readOnly 
                            precision={1}
                            icon={<StarIcon fontSize="small" />}
                            emptyIcon={<StarIcon fontSize="small" />}
                          />
                        </Box>
                      )}
                      {book.status === 'Lido' && book.data_conclusao && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Concluído em: {new Date(book.data_conclusao).toLocaleDateString('pt-BR')}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <IconButton 
                        aria-label="editar" 
                        size="small"
                        onClick={() => handleEditBook(book.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        aria-label="excluir" 
                        size="small" 
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setNewBook({ titulo: '', autor: '', descricao: '', status: 'Quero Ler', avaliacao: 0 });
              setOpenDialog(true);
            }}
            size="large"
            sx={{ minWidth: 200 }}
          >
            Adicionar Livro
          </Button>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{newBook.id ? 'Editar Livro' : 'Adicionar Novo Livro'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Título"
              fullWidth
              variant="outlined"
              value={newBook.titulo}
              onChange={(e) => setNewBook({...newBook, titulo: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Autor"
              fullWidth
              variant="outlined"
              value={newBook.autor}
              onChange={(e) => setNewBook({...newBook, autor: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Descrição (Opcional)"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={newBook.descricao}
              onChange={(e) => setNewBook({...newBook, descricao: e.target.value})}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                value={newBook.status}
                label="Status"
                onChange={(e) => setNewBook({...newBook, status: e.target.value as Book['status']})}
              >
                <MenuItem value="Quero Ler">Quero Ler</MenuItem>
                <MenuItem value="Lendo">Lendo</MenuItem>
                <MenuItem value="Lido">Lido</MenuItem>
              </Select>
            </FormControl>
            {newBook.status === 'Lido' && (
              <Box sx={{ mt: 2 }}>
                <Typography component="legend">Avaliação</Typography>
                <Rating
                  value={newBook.avaliacao || 0}
                  onChange={(_, value) => setNewBook({...newBook, avaliacao: value || 0})}
                  precision={1}
                  icon={<StarIcon fontSize="large" />}
                  emptyIcon={<StarIcon fontSize="large" />}
                />
                <TextField
                  margin="dense"
                  label="Data de Conclusão"
                  type="date"
                  fullWidth
                  value={newBook.data_conclusao ? new Date(newBook.data_conclusao).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewBook({...newBook, data_conclusao: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
              onClick={newBook.id ? handleSaveEdit : handleAddBook} 
              variant="contained"
              disabled={!newBook.titulo || !newBook.autor}
            >
              {newBook.id ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}