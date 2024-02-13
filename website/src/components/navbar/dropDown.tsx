// Dropdown.js
import { StyledLink, StyledImage } from './navbarCSS'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  display: ${(props: any) => (props.isOpen ? 'block' : 'none')};
`;

const MenuItem = styled.button`
  padding: 10px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

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