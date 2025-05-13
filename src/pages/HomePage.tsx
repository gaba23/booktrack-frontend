import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Card,
  CircularProgress,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Navbar } from '../components/Layout/Navbar.tsx';
import { BookForm } from '../components/Livros/FormLivro.tsx';
import { BookList } from '../components/Livros/ListaLivros.tsx';
import api, { setAuthToken } from '../services/api.ts';

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

export function HomePage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('@BookTrack:token');
    if (!token) {
      navigate('/login');
    } else {
      setAuthToken(token);
      fetchBooks();
    }
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/livros/meus-livros');
      setBooks(response.data);
    } catch (err) {
      console.error('Erro ao recuperar os livros:', err);
      setError(err.response?.data?.message || 'Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: Omit<Book, 'id'>) => {
    try {
      const response = await api.post('/livros/adicionar', bookData);
      setBooks([...books, response.data]);
      setOpenDialog(false);
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

  const handleEditBook = (id: string) => {
    const livroParaEditar = books.find(book => book.id === id);
    if (livroParaEditar) {
      setSelectedBook(livroParaEditar);
      setOpenDialog(true);
    }
  };

  const handleSaveEdit = async (bookData: Omit<Book, 'id'>) => {
    if (!selectedBook) return;
    
    try {
      const response = await api.put(`/livros/editar/${selectedBook.id}`, bookData);
      setBooks(books.map(book => book.id === selectedBook.id ? response.data : book));
      setOpenDialog(false);
      setSelectedBook(undefined);
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
            <BookList 
              books={books}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          )}
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedBook(undefined);
              setOpenDialog(true);
            }}
            size="large"
            sx={{ minWidth: 200 }}
          >
            Adicionar Livro
          </Button>
        </Box>

        <BookForm
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedBook(undefined);
          }}
          onSubmit={selectedBook ? handleSaveEdit : handleAddBook}
          initialData={selectedBook}
        />
      </Container>
    </div>
  );
}