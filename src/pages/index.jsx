
import Layout from '../components/layout';
import React from 'react';

import Test from '../components/text';


const IndexPage = () => {
  return (
    <Layout>
      <Test />
    </Layout>
  );
}

export const Head = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>My name is Makana!!</title>
    </>
  );
 };

export default IndexPage;

