import { createTheme } from '@mui/material'

export default createTheme({
  palette: {
    primary: {
      main: "#0E73F6",
      light: "#d7edff"
    },
    error: {
      main: '#f76659',
      light: '#ffefea'
    },
    success: {
      main: '#119c2b',
      light: "#bbfbd0"
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
  }
})

