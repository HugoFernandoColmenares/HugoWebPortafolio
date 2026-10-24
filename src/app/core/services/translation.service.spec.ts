import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  afterEach(() => localStorage.removeItem('portfolio_lang'));

  it('keeps <html lang> in sync with the active language', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('es');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('es');
    service.setLanguage('en');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('en');
  });

  it('has every public key translated in both languages', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en');
    const en = service.t();
    service.setLanguage('es');
    const es = service.t();
    const missing = Object.keys(en).filter(key => !(es as Record<string, string>)[key]);
    expect(missing).toEqual([]);
  });

  it('formats placeholders', () => {
    const service = TestBed.inject(TranslationService);
    service.setLanguage('en');
    expect(service.format('footer_copy', { year: 2026 })).toContain('2026');
  });
});
