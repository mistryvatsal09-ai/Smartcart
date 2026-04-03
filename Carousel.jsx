import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Carousel.css";

const defaultSlides = [
    {
        id: "s1",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
        title: "Future of Performance",
        subtitle: "Engineered for speed, designed for comfort.",
    },
    {
        id: "s2",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        title: "Pure Sound Immersion",
        subtitle: "Hear every detail with studio-quality audio.",
    },
    {
        id: "s3",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        title: "Modern Minimalist",
        subtitle: "Seamlessly integrate technology into your lifestyle.",
    },
];

const Carousel = ({ slides = defaultSlides }) => {
    // We add clones: [Last, First, Second, Last, First]
    const [allSlides, setAllSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const autoPlayRef = useRef();

    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const firstClone = slides[0];
        const lastClone = slides[slides.length - 1];
        setAllSlides([lastClone, ...slides, firstClone]);
    }, [slides]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentIndex === 0) {
            setTransitionEnabled(false);
            setCurrentIndex(allSlides.length - 2);
        } else if (currentIndex === allSlides.length - 1) {
            setTransitionEnabled(false);
            setCurrentIndex(1);
        }
    };

    const nextSlide = useCallback(() => {
        if (isTransitioning) return;
        setTransitionEnabled(true);
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning]);

    const prevSlide = () => {
        if (isTransitioning) return;
        setTransitionEnabled(true);
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const goToSlide = (index) => {
        if (isTransitioning) return;
        setTransitionEnabled(true);
        setIsTransitioning(true);
        setCurrentIndex(index + 1);
    };

    useEffect(() => {
        if (!transitionEnabled) {
            // Tiny timeout to let the state update before re-enabling transition
            const timer = setTimeout(() => setTransitionEnabled(true), 50);
            return () => clearTimeout(timer);
        }
    }, [transitionEnabled]);

    useEffect(() => {
        autoPlayRef.current = nextSlide;
    });

    useEffect(() => {
        const play = () => {
            autoPlayRef.current();
        };
        const timer = setInterval(play, 6000);
        return () => clearInterval(timer);
    }, []);

    if (!slides || slides.length === 0 || allSlides.length === 0) return null;

    // Helper to calculate the active indicator
    const activeDot = currentIndex === 0 ? slides.length - 1 : (currentIndex === allSlides.length - 1 ? 0 : currentIndex - 1);

    return (
        <div className="carousel-container">
            <div
                className="carousel-wrapper"
                onTransitionEnd={handleTransitionEnd}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: transitionEnabled ? 'transform 1000ms cubic-bezier(0.65, 0, 0.35, 1)' : 'none'
                }}
            >
                {allSlides.map((slide, index) => (
                    <div
                        key={`${slide.id || index}-${index}`}
                        className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="carousel-overlay"></div>
                        <div className="carousel-content">
                            <span className="featured-badge">Featured Product</span>
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>

                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous Slide">
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="carousel-btn next" onClick={nextSlide} aria-label="Next Slide">
                <i className="fa-solid fa-chevron-right"></i>
            </button>

            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`dot-wrapper ${index === activeDot ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                    >
                        <span className="dot"></span>
                        <div className="dot-progress"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
