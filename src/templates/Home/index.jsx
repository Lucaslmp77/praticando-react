import { useCallback, useEffect, useState } from 'react';

import './styles.css';

import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage] = useState(3);
  const [searchValue, setSearchValue] = useState('');
  
  const noMorePosts = page + postsPerPage >= allPosts.length;

  const filteredPosts = !!searchValue ? allPosts.filter(post => {
    return post.title.toLowerCase().includes(searchValue.toLowerCase());
  })
  : posts;

  const HandleloadPosts = useCallback(async (page, postsPerPage) => {
    const postsAnsPhotos = await loadPosts();
    
    setPosts(postsAnsPhotos.slice(page, postsPerPage));
    setAllPosts(postsAnsPhotos);
  }, []);

  useEffect(() => {
    HandleloadPosts(0, postsPerPage);
  }, [HandleloadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);

    posts.push(...nextPosts);

    setPosts(posts);
    setPage(nextPage);
  }

  const handleChange = (e) => {
    const { value } = e.target;

    setSearchValue(value);
  }

  return (
    <section className='container'>
      <div className='search-container'>
        {!!searchValue && (
          <h1>Busca = {searchValue}</h1>
        )}

        <TextInput searchValue={searchValue} handleChange={handleChange}/>
      </div>

      {filteredPosts.length > 0 && (
        <Posts posts={filteredPosts} />
      )}

      {filteredPosts.length === 0 && (
        <p>Nenhum post encontrado =(</p>
      )}

      
      <div className='button-container'>
        {!searchValue && (
          <Button
            text="Load more posts"
            onClick={loadMorePosts}
            disabled={noMorePosts}
          />
        )}
        
      </div>
    </section>
  );
}