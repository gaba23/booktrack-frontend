import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Rating
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';

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

interface BookCardProps {
  book: Book;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {book.titulo}
        </Typography>
        {book.autor && (
          <Typography color="text.secondary" sx={{ mb: 1.5 }}>
            {book.autor}
          </Typography>
        )}
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
          onClick={() => onEdit(book.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton 
          aria-label="excluir" 
          size="small" 
          onClick={() => onDelete(book.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
} 