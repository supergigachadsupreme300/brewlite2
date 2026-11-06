export class AppService {
  getHealth(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'brewlite-api',
    };
  }
}
