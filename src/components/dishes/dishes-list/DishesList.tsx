import './DishesList.scss';
import 'swiper/scss';
import { Dish } from '../../../interfaces/Dish';
import { lastViewedDishContext } from '../../../contexts/LastViewedDishContext';
import { DISHES_QUERY } from '../../../constants/QueryConstants';
import {
  LAST_RECIPE_BUTTON,
  LAST_RECIPE_IMAGE,
  LAST_RECIPE_TITLE,
  NO_RECIPES_BUTTON,
  NO_RECIPES_IMAGE,
  NO_RECIPES_TITLE
} from '../../../constants/DishesConstants';
import { DishesPage, getDishesPage } from '../../../services/DishService';
import DishCard from '../dish-card/DishCard';
import ErrorDishCard from '../dish-card/error-dish-card/ErrorDishCard';
import QueryResultsBuilder from '../../../utility/Builder';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box } from '@mui/material';
import SwiperRef, { EffectCreative, Virtual } from 'swiper';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useContext, useState } from 'react';

interface DishesListProps {
  className?: string;
}

const DishesList = ({ className }: DishesListProps) => {
  const { lastViewedDish, setLastViewedDish } = useContext(lastViewedDishContext);
  const [isFrontSide, setFrontSide] = useState(true);
  const [swiperRef, setSwiperRef] = useState<SwiperRef | null>(null);

  const { data, fetchNextPage, hasNextPage, fetchPreviousPage, isFetching, status, refetch } =
    useInfiniteQuery(
      [DISHES_QUERY, { tag: lastViewedDish.tag.id }],
      ({ pageParam = 0 }) => getDishesPage(lastViewedDish.tag.id, pageParam),
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.hasNext) return lastPage.currentPage + 1;
          else return undefined;
        },
        getPreviousPageParam: (lastPage) => {
          if (lastPage.hasPrevious) return lastPage.currentPage - 1;
          else return undefined;
        }
      }
    );

  const flipCard = useCallback(() => {
    setFrontSide((prevState) => !prevState);
  }, []);

  const updateLastViewedDish = useCallback(() => {
    if (swiperRef) setLastViewedDish({ ...lastViewedDish, slide: swiperRef.activeIndex });
  }, [lastViewedDish, swiperRef?.activeIndex]);

  const goToFirstSlide = useCallback(() => {
    if (swiperRef) swiperRef.slideTo(0);
  }, [swiperRef]);

  const prepareDishesSlides = useCallback(
    (dishPages: DishesPage[]) => {
      const extractedDishes: Dish[] = [];
      dishPages.forEach((page) => {
        extractedDishes.push(...page.dishes);
      });

      return extractedDishes.map((dish) => {
        return (
          <SwiperSlide key={dish.id} virtualIndex={dish.id}>
            <DishCard dish={dish} flipCallback={flipCard} isFrontSide={isFrontSide} />
          </SwiperSlide>
        );
      });
    },
    [isFrontSide, data]
  );

  return QueryResultsBuilder.createResult(status)
    .onSuccess(
      <>
        {data && (
          <Swiper
            modules={[Virtual, EffectCreative]}
            effect="creative"
            creativeEffect={{
              prev: { translate: [0, '-120%', -500] },
              next: { translate: [0, '120%', -500] }
            }}
            allowSlidePrev={isFrontSide}
            allowSlideNext={isFrontSide}
            initialSlide={lastViewedDish.slide}
            onSwiper={setSwiperRef}
            onReachEnd={() => fetchNextPage()}
            onReachBeginning={() => fetchPreviousPage()}
            onSlideChangeTransitionEnd={updateLastViewedDish}
            slidesPerView={1}
            direction="vertical"
            virtual={{ enabled: true, cache: false, addSlidesAfter: 1, addSlidesBefore: 1 }}
            className={`dishes-list-container ${className}`}>
            {prepareDishesSlides(data.pages)}
            {!hasNextPage && !isFetching ? (
              <SwiperSlide>
                <ErrorDishCard
                  callback={goToFirstSlide}
                  img={LAST_RECIPE_IMAGE}
                  title={LAST_RECIPE_TITLE}
                  caption={LAST_RECIPE_BUTTON}
                />
              </SwiperSlide>
            ) : (
              <SwiperSlide>
                <ErrorDishCard loading />
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </>
    )
    .onError(
      <Box className={`dishes-list-container error ${className}`}>
        <ErrorDishCard
          callback={refetch}
          img={NO_RECIPES_IMAGE}
          title={NO_RECIPES_TITLE}
          caption={NO_RECIPES_BUTTON}
        />
      </Box>
    )
    .build();
};

export default DishesList;
