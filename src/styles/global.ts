import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
 * {
  margin: 0;
  padding: 0;
  outline: 0;
  box-sizing: border-box;
 }

 body {
  font: 16px sans-serif;
  -webkit-font-smoothing: antialiased;
 }

 #root {
  display: flex;
  align-items: center;
  justify-content: center;
 }

 p {
  hyphens: auto;
  text-align: justify;
 }
 
 a {
 text-decoration: none;
 }
 
 button,
 img {
  cursor: pointer;
  background: transparent;
  border: none;
 }

 label{
  cursor: text
 }
`;
