// Dropdown.js
import { StyledImage } from './navbarCSS'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(6vh - 5px);
  right: 0;
  width: calc(7em + 5px);

  background-color: #fff;
  border: 1px solid lightgray;
  border-radius: 0.5em;

  padding: 1em;

  display: ${(props: any) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
`;

const MenuItem = styled.button`
  padding: 10px;
  font-size: 1em;
  width: 6em;
  margin-top: 0.5em;
  &:hover {
    background-color: #f1f1f1;
  }
`

const StyledLink = styled(Link)`
  margin: 0;
  font-size: 1.5em;

  color: black;
  text-decoration: none;

  border-bottom: 1px solid white;
  transition: 0.2s;

  &:hover{
    cursor: pointer;
    border-bottom: 1px solid black;
  }
`

const Dropdown = ({ options, text, url }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <DropdownContainer>
      <StyledImage onClick={()=>toggleDropdown()} src={url}></StyledImage>

      <DropdownMenu isOpen={isOpen}>
        <StyledLink to={`/${text}`}>{text}</StyledLink>
        {options.map((option: any, index: any) => (
          <MenuItem key={index} onClick={option.func}>{option.text}</MenuItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default Dropdown;