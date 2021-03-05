import '@/reflect-metadata';
import '@/extension';
import { Container } from 'typedi';
import { Game } from '@/service/Game';
import './main.scss';

export function bootstrap() {
  const game = Container.get(Game);
  game.init();

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'debug'
  ) {
    window.game = game;
  }
}

bootstrap();

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => Container.reset());
}
