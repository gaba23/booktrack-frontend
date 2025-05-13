import React from 'react';
import { Box } from '@mui/material';
import { BookCard } from './CartaoLivro.tsx';

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

interface BookListProps {
  books: Book[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookList({ books, onEdit, onDelete }: BookListProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
      {books.map((book) => (
        <Box key={book.id}>
          <BookCard
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Box>
      ))}
    </Box>
  );
} 