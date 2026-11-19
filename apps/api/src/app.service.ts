export class AppService {
  // CI success demo change
  getHealth(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'brewlite-api',
    };
  }
}
