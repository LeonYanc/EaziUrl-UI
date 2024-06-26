import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const NewLink = () => {
  const { currentUser } = useContext(UserContext);
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (longUrl) {
      const fetchTitle = async () => {
        try {
          const response = await axios.post('/api/fetch_title', {
            url: longUrl,
          });
          setTitle(response.data.title);
        } catch (error) {
          console.error('Error fetching title', error);
          setTitle('');
        }
      };

      fetchTitle();
    }
  }, [longUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/encode',
        {
          url: longUrl,
          title: title || 'No title',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/generatedlink', {
        state: {
          realUrl: response.data.real_url,
          title: title || 'No title',
          longUrl: longUrl,
        },
      });
    } catch (error) {
      console.error('There was an error encoding the URL!', error);
    }
  };

  if (!currentUser) {
    return (
      <Wrapper>
        <Message>You need to be logged in to create a link.</Message>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <FormContainer>
        <Title>Create a New Link</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Long URL:</Label>
            <Input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Title:</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder=""
            />
          </FormGroup>
          <Button type="submit">Create Link</Button>
        </Form>
      </FormContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  color: #007bff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  text-align: left;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

export default NewLink;
