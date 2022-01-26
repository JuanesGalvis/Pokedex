import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Paginacion } from '../components/pagination';

import styles from '../styles/Home.module.sass';
import pokeball from '../assets/pokeball.png';

import { Grid } from  'react-loader-spinner';

export default function Home() {
  const [pokemones, setPokemones] = useState([]);
  const [selected, setSelected] = useState({});
  const [page, setPage] = useState(0);

  // Ejecutará al inicio y cada vez que cambiemos la paginación
  useEffect(() => {
    fetchData();
  }, [page]);

  async function fetchData () {
    try {
      // Fetch de la lista de pokemones
      const response = await fetch(`${process.env.api}?limit=${page === 150 ? 1 : 10}&offset=${page}`);
      const data = await response.json();
      const list = [...data.results];
      let PokemonesAux = [];
      // Fetch a cada pokemon
      for (let i = 0; i < list.length; i++) {
        const res = await fetch(list[i].url);
        const dat = await res.json();
        PokemonesAux.push(dat);
      }
      
      setSelected(PokemonesAux[0]);
      setPokemones([...PokemonesAux]);
      
    } catch (error) {
      // Aviso de error en caso de fallo con la API
      alert('⚠ Ha ocurrido un error con el servidor ⚠ vuelve a intentarlo después');
    }
  }

  function handlerSelectPokemon (pokemon) {
    setSelected(pokemon);
  }

  return (
    <div>
      <Head>
        {/* Metadata */}
        <title>Pokedex</title>
        <meta name="description" content="Pokedex con Next.js" />
        <link rel="icon" href="/icon.ico" />
      </Head>
      <header className={styles.header}>
        <figure className={styles['header__pokeball']}>
          <Image 
            src={pokeball}
            width={50}
            height={50}
            alt='Pokeball' />
        </figure>
        <h1 className={styles['header__title']}> Pokedex </h1>
      </header>
      <main className={styles.main}>
      {/* Presentación pokemon seleccionado */}
      <section className={Object.keys(selected).length > 0 ? styles.onePokemon : 'hidden'}> 
          {
            Object.keys(selected).length > 0 && <article>
              <h2>{selected.name.toUpperCase()}</h2>
              <h3>{`N.° ${selected.id}`}</h3>
              <p>{selected.weight} kg - {selected.height} m</p>
              <Image 
                src={selected.sprites.other.dream_world.front_default} 
                width={200} 
                height={192} 
                alt={selected.name}
                className={styles['pokemon__img']} />
                <h3>Tipo:</h3>
                <div className={styles['pokemon__types']}>
                  {
                    selected.types.map((tipo, index) => (
                      <span key={`types-pokemon-${selected.name}-${index}`} className={styles['pokemon__type']}>{tipo.type.name}</span>
                    ))
                  }
                </div>
                <h3>Habilidades:</h3>
                <div className={styles['pokemon__types']}>
                  {
                    selected.abilities.map((tipo, index) => (
                      <span key={`types-pokemon-${selected.name}-${index}`} className={styles['pokemon__type']}>{tipo.ability.name}</span>
                    ))
                  }
                </div>
            </article>
          }
        </section>
        {/* Listado de los 10 pokemanes */}
        <section start={page+1} className={styles.listPokemones}>
          {
            pokemones.length > 0 ?
            pokemones.map((pokemon, index) => (
              <article key={`pokemon-${index}`} className={pokemon.name === selected.name ? `${styles.selected}` : ''}>
                <Image 
                  src={pokemon.sprites.other.dream_world.front_default} 
                  width={200} 
                  height={192} 
                  alt={pokemon.name}
                  className={styles['pokemon__img']} />
                <p className={styles['pokemon__name']}>{pokemon.name}</p>
                <button onClick={() => handlerSelectPokemon(pokemon)} className={styles['pokemon__button']}>Ver más</button>
              </article>
            )) :
              <Grid
              heigth="100"
              width="100"
              color='black'
              ariaLabel='loading'
            />
          }
        </section>
      </main>
      <footer className={styles.footer}>
        <button className={styles.btnNavigation} disabled={page === 0} onClick={() => setPage(page-10)}>⬅ Previo</button>
        {/* Números de páginas para navegación */}
        <Paginacion updateState={setPage} state={page} />
        <button disabled={page === 150} className={styles.btnNavigation} onClick={() => setPage(page+10)}>Siguiente ➡</button>
      </footer>
    </div>
  );
}
