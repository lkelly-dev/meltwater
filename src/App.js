import './App.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const App = () => {
  const [docText, setDocText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [formattedKeywords, setFormattedKeywords] = useState([]);
  const [censoredText, setCensoredText] = useState('');

  const removeKeywordsFromString = (str, keyWords) => {
    if (!keyWords || keyWords.length === 0) return str;

    //replace single quotes with doubles and then split by comma
    const splitStrArray = keyWords.replace(/'/g, '"').split(',');

    let formattedKeyArray = [];
    //Loop over the newly split items and split them again by white space, preserving quoted phrases
    //Add the final values to a new array and clean them up by removing useless characters
    splitStrArray.forEach((item) => {
      const splitBySpacesAndQuotes = item.match(/\w+|"(?:\\"|[^"])+"/g) || [];
      splitBySpacesAndQuotes.forEach((subItem) =>
        formattedKeyArray.push(subItem.replace(/['"]+/g, '').trim())
      );
    });

    setFormattedKeywords(formattedKeyArray);
    let newText = str;
    formattedKeyArray.forEach((phrase) => (newText = newText.replaceAll(phrase, 'XXXX')));
    setCensoredText(newText);
  };

  useEffect(() => {
    removeKeywordsFromString(docText, keywords);
  }, [keywords, docText]);

  return (
    <div className="App">
      <div className="App-container">
        <Title>Meltwater</Title>
        <SubTitle>Document classifier</SubTitle>
        <section>
          <InputSection>
            <label>Keywords and Phrases: </label>
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </InputSection>
          <div>
            <KeywordList>
              {formattedKeywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </KeywordList>
          </div>
          <InputSection>
            <label>Text to Censor:</label>
            <textarea value={docText} onChange={(e) => setDocText(e.target.value)} />
          </InputSection>
          <div style={{ maxWidth: '500px' }}>
            <p>Output: {censoredText}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;

const Title = styled.h1`
  margin: 10px 0px;
`;

const SubTitle = styled.h3`
  margin: 10px 0px;
`;

const InputSection = styled.div`
  margin: 0.4rem 0px 1.2rem 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  label {
    margin-right: 10px;
  }
`;

const KeywordList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 16px;
`;
