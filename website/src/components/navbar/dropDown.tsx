// Dropdown.js
import { StyledImage } from './navbarCSS'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 95%;
  right: -2vw;
  background-color: #fff;
  display: ${(props: any) => (props.isOpen ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: end; /* start or center too */
`;

const MenuItem = styled.button`
  padding: 10px;
  font-size: 1em;
  width: 6em;
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
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const openDropdown = () => setIsOpen(true)
  const closeDropdown = () => setIsOpen(false)

  return (
    <DropdownContainer>
      <StyledImage onClick={()=>navigate(`/${text}`)} onMouseEnter={openDropdown} onMouseLeave={closeDropdown} src={url}></StyledImage>
      <DropdownMenu isOpen={isOpen} onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
        <StyledLink to={`/${text}`}>{text}</StyledLink>
        {options.map((option: any, index: any) => (
          <MenuItem key={index} onClick={option.func}>{option.text}</MenuItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default Dropdown;