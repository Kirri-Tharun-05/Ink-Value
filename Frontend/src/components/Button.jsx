import React from 'react'

export const Button = () => {

    const onHover = (e) => {
        let button = e.target;
        let text = button.textContent;
        button.innerHTML = '';
        for (let ch of text) {
            let span = document.createElement('span');
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            button.appendChild(span);
        }

        let spans = document.querySelectorAll('span');
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('hover');
            }, index * 50)
        });
    }
    const onLeave = () => {
        let spans = document.querySelectorAll('span');
        spans.forEach((span, index) => {
            setTimeout(() => {
                span.classList.remove('hover');
            }, index * 50);
        })
    }

    return (
        <>
            <button className='button' onMouseEnter={onHover} onMouseLeave={onLeave}>Hello!</button>
        </>
    )
}
