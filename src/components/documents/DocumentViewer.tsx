import React, { useState } from 'react';
import { Document } from '@/types';
import { Box, Card, IconButton, Typography, Slider, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const formatContent = (content: string) => {
    // Split content into pages (this is a simple example, in real app you'd parse PDF)
    return content.split('\n\n').filter(page => page.trim());
  };

  const pages = formatContent(document.content);
  const totalPages = pages.length;

  return (
    <Card sx={{
      position: 'relative',
      height: '80vh',
      maxWidth: '90vw',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#f5f5f5'
    }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'white'
      }}>
        <Typography variant="h6">{document.title}</Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      {/* Toolbar */}
      <Box sx={{
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut />
          </IconButton>
          <Box sx={{ width: 100 }}>
            <Slider
              value={zoom}
              onChange={handleZoomChange}
              min={50}
              max={200}
              step={10}
              valueLabelDisplay="auto"
              valueLabelFormat={value => `${value}%`}
            />
          </Box>
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="body2">
            Page {currentPage} of {totalPages}
          </Typography>
          <IconButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Document Content */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        p: 3,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{
          bgcolor: 'white',
          p: 4,
          boxShadow: 1,
          borderRadius: 1,
          width: `${zoom}%`,
          maxWidth: '100%',
          transition: 'width 0.3s ease'
        }}>
          <pre style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: 1.5
          }}>
            {pages[currentPage - 1]}
          </pre>
        </Box>
      </Box>
    </Card>
  );
};

export default DocumentViewer;