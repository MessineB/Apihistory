import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchHistoryService {
  private historyByPlayer: Record<string, { tagLine: string; timestamp: Date }[]> = {};

  addToHistory(gameName: string, tagLine: string) {
    const key = gameName.toLowerCase();
    if (!this.historyByPlayer[key]) {
      this.historyByPlayer[key] = [];
    }
    this.historyByPlayer[key].unshift({ tagLine, timestamp: new Date() });

    if (this.historyByPlayer[key].length > 10) {
      this.historyByPlayer[key].pop();
    }
  }

  getHistoryForPlayer(gameName: string) {
    return this.historyByPlayer[gameName.toLowerCase()] || [];
  }
}
