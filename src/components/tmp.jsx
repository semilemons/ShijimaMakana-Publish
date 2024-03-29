以下の変更を加えることで、キャッシュ機能を追加できます。


import axios from "axios";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const FetchLatestMdOne = () => {
 const [fileData, setFileData] = useState(null);
 const [cachedFileData, setCachedFileData] = useState(null);

 // GitHubリポジトリ内のファイルを再帰的に取得する関数
 const fetchFiles = async (url) => {
  let allMdFiles = [];
  const queue = [url];

  while (queue.length > 0) {
   const currentUrl = queue.shift();
   const response = await axios.get(currentUrl);
   const files = response.data;

   for (const file of files) {
    if (file.type === 'file' && file.name.endsWith('.md')) {
     allMdFiles.push(file);
    } else if (file.type === 'dir') {
     queue.push(file.url); // サブディレクトリをキューに追加
    }
   }
  }

  return allMdFiles;
 };

 // コンポーネントのマウント時にファイルを取得
 useEffect(() => {
  const baseApiUrl = `https://api.github.com/repos/semilemons/ShijimaMakana-Publish/contents/markdown-pages`;
  fetchFiles(baseApiUrl)
   .then(mdFiles => {
    if (mdFiles.length === 0) {
     throw new Error('Markdownファイルが見つかりません。');
    }
    // 取得したファイルの中から最新のファイルを選択
    const latestFile = mdFiles.reduce((a, b) => (a.name > b.name ? a : b));

    // キャッシュにファイルを保存
    setCachedFileData(latestFile);

    // キャッシュからファイルを取得
    const cachedFileData = getCachedFileData();
    if (cachedFileData) {
     setFileData(cachedFileData);
    } else {
     // キャッシュにファイルがなければ、サーバから取得
     axios.get(latestFile.download_url)
      .then(response => {
       setFileData(response.data); // ファイルの内容をセット
      })
      .catch(error => {
       console.error(error);
       // エラーハンドリング
      });
    }
   })
   .catch(error => {
    console.error(error);
    // エラーハンドリング
   });
 }, []);

 // キャッシュからファイルを取得する関数
 const getCachedFileData = () => {
  if (cachedFileData === null) {
    return null;
  }

  const latestFile = fetchFiles(baseApiUrl).then(mdFiles => {
    if (mdFiles.length === 0) {
     return null;
    }
    return mdFiles.reduce((a, b) => (a.name > b.name ? a : b));
  });

  return latestFile && cachedFileData.name === latestFile.name ? cachedFileData : null;
 };

 return (
  <div>
   {fileData ? (
    <ReactMarkdown>{fileData}</ReactMarkdown>
   ) : (
    <p>データを読み込んでいます...</p> 
   )}
  </div>
 );
};

export default FetchLatestMdOne;
