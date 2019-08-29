import { createElement, rgbToHex } from '../src/lib';
import 'jest-dom/extend-expect';

describe('createElement', () => {
  it('Should be an instance of function', () => {
    expect(createElement).toBeInstanceOf(Function);
  });
  it('Should return correct element', () => {
    const result = createElement('span', 'button button__tip', 'Delete this frame');
    const expected = '<span class="button button__tip">Delete this frame</span>';
    expect(result.outerHTML).toEqual(expected);
  });
  it('Should return correct element with inner element', () => {
    document.body.innerHTML = '<div class="button__wrapper"><button class="frames__button" type="button">Add new frame</button><div class="button__icon"></div></div>';
    const div = document.querySelector('.button__icon');
    const result = createElement('div', 'button__wrapper', div);
    const expected = '<div class="button__wrapper"><div class="button__icon"></div></div>';
    expect(result.outerHTML).toEqual(expected);
  });
  it('Should return correct element without class', () => {
    const result = createElement('img');
    const expected = '<img>';
    expect(result.outerHTML).toEqual(expected);
  });
});

describe('rgbToHex', () => {
  it('Should be an instance of function', () => {
    expect(rgbToHex).toBeInstanceOf(Function);
  });
  it('Should return correct HEX color', () => {
    const result = rgbToHex([251, 211, 0]);
    const expected = '#fbd300';
    expect(result).toEqual(expected);
  });
});
