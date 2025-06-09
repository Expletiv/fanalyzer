# Fanalyzer Project Guidelines

## Project Overview
Fanalyzer is a web application designed to provide a browser-based interface for viewing Portfolio Performance .xml files. It allows users to analyze their financial portfolio data directly in the browser without needing the desktop application.

## Technical Stack
- **Frontend**: Angular application utilizing PrimeNG for UI components and Tailwind CSS with the Prime UI plugin
- **Server-Side Rendering (SSR)**: Implemented using an Express server
- **Reverse Proxy**: Caddy with cache functionality
- **Data Source**: Yahoo Finance API for live stock market data

## Core Functionality
- Import and parse Portfolio Performance .xml files
- Display portfolio data in a user-friendly web interface
- Provide real-time stock market information through Yahoo Finance API integration
- Enable users to analyze their financial investments through various visualizations and reports

## Purpose
The main goal of Fanalyzer is to make portfolio analysis more accessible by providing a web-based alternative to the desktop Portfolio Performance application, with the added benefit of live market data integration.

## File Structure
The project follows a standard Angular application structure with additional components for server-side rendering:

### Root Directory
- `src/`: Source code for the application
- `config/`: Configuration files for the project
- `public/`: Public assets
- `node_modules/`: Node.js dependencies
- Docker and compose files for containerization

### Source Code (`src/`)
- `app/`: Main application code
- `index.html`: Main HTML template
- `main.ts`: Client-side entry point
- `main.server.ts`: Server-side entry point for SSR
- `server.ts`: Express server configuration for SSR
- `styles.css`: Global styles

### Application Code (`src/app/`)
- `component/`: UI components
  - `main/`: Primary application components
    - `lists/`: Components for displaying data lists
    - `menubar/`: Navigation menu components
    - `security-detail/`: Components for security details
    - `yahoo-finance-chart/`: Components for financial charts
  - `util/`: Utility components
- `parser/`: XML parsing functionality
  - `portfolio-parser.ts`: Parser for Portfolio Performance XML files
- `service/`: Application services
  - `pp-client.service.ts`: Portfolio Performance client service
  - `theme.service.ts`: Theme management service
  - `yahoo-finance.service.ts`: Yahoo Finance API service
- `types/`: TypeScript type definitions
  - `portfolio-performance.ts`: Types for Portfolio Performance data
  - `yahoo-finance.ts`: Types for Yahoo Finance API data
